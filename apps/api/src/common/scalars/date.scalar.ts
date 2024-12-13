import { Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime')
export class DateScalar {
  description = 'Date custom scalar type';

  parseValue(value: number): Date {
    return new Date(value); // value from the client
  }

  // This method is used to serialize the value before sending it to the client
  serialize(value: Date): number {
    return value.getTime();
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.INT) {
      return new Date(Number(ast.value)); // If it receives Timestamp format
    }
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // If it receives ISO string format
    }
    return null;
  }
}
