import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { GlobalRole, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  findAll(roles?: GlobalRole[]): Promise<User[]> {
    // If roles are provided, only the users with the provided roles will be returned
    const where: Prisma.UserWhereInput = {
      status: 'ACTIVE', // ✅ Add this line
    };

    if (roles && roles.length > 0) {
      where.globalRole = { in: roles };
    }

    return this.prisma.user.findMany({
      where,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserInput: GraphQLTypes.UpdateUserInput,
    updatePasswordInput?: GraphQLTypes.UpdatePasswordInput,
  ): Promise<User> {
    let hashedPassword: string | undefined = undefined;

    const { oldPassword, newPassword, confirmPassword } =
      updatePasswordInput || {};

    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new UserInputError(
          'All password fields (old, new, confirm) are required.',
        );
      }

      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new UserInputError(`User #${id} not found`);
      }

      const isOldPasswordValid = await argon.verify(
        existingUser.hash,
        oldPassword,
      );
      if (!isOldPasswordValid) {
        throw new UserInputError('Old password is incorrect');
      }

      if (newPassword !== confirmPassword) {
        throw new UserInputError(
          'New password and confirm password do not match',
        );
      }

      hashedPassword = await argon.hash(newPassword);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserInput?.email || undefined,
        fullName: updateUserInput?.fullName || undefined,
        workPlace: updateUserInput?.workPlace || undefined,
        phoneNumber: updateUserInput?.phoneNumber || undefined,
        globalRole: (updateUserInput?.globalRole as GlobalRole) || undefined,
        isGlobalVisibility: updateUserInput?.isGlobalVisibility ?? undefined,
        ...(hashedPassword && { hash: hashedPassword }),
      },
    });

    if (!updatedUser) {
      throw new UserInputError(`User #${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new UserInputError(`User #${id} not found`);
    }
    return user;
  }

  // Admin can invite technician by sending an email to their address
  async createUserWithEmail(input: { email: string }): Promise<User> {
    const { email } = input;
    const existing = await this.prisma.user.findUnique({
      where: { email, status: 'INVITED' },
    });
    if (existing) {
      throw new UserInputError(`Email "${email}" already exists`);
    }

    //setup user inivation mail here

    let newUser: User;

    try {
      // 1. Create the user
      newUser = await this.prisma.user.create({
        data: {
          email,
          hash: '',
          fullName: 'N/A',
          workPlace: 'N/A',
          status: 'INVITED',
        },
      });

      // 2. Send invitation email
      const username = email.split('@')[0];
      const to = email;
      const baseUrl = this.configService.get<string>('WEB_APP_BASE_URL');

      await this.mailerService.sendMail({
        to,
        subject: "You're invited to join – Set up your account now",
        template: './user-invitation',
        context: {
          username,
          baseUrl,
          email: to,
          logoCid: 'sandviklogo',
        },
        attachments: [
          {
            filename: 'sandvik_icon.jpg',
            path: join(__dirname, '..', 'assets', 'images', 'sandvik_icon.jpg'),
            cid: 'sandviklogo',
          },
        ],
      });
    } catch (error) {
      // 3. Handle error: log it and optionally rethrow
      throw new Error('User created but failed to send invitation email.');
    }

    // 4. Return created user
    return newUser;
  }
}
