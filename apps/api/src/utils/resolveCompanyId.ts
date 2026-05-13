import { PrismaService } from 'src/prisma/prisma.service';

type ParentChainEntry = {
  model: keyof PrismaService;
  idField: string;
  parentField: string | null;
  parentModel: keyof PrismaService | null;
};

const parentChain: Record<string, ParentChainEntry> = {
  level: {
    model: 'level',
    idField: 'id',
    parentField: 'siteId',
    parentModel: 'site',
  },
  drive: {
    model: 'drive',
    idField: 'id',
    parentField: 'levelId',
    parentModel: 'level',
  },
  location: {
    model: 'location',
    idField: 'id',
    parentField: 'driveId',
    parentModel: 'drive',
  },
  site: {
    model: 'site',
    idField: 'id',
    parentField: 'companyId',
    parentModel: 'company',
  },
  userPermission: {
    model: 'userPermission',
    idField: 'id',
    parentField: 'companyId',
    parentModel: 'company',
  },
  boltResult: {
    model: 'boltResult',
    idField: 'id',
    parentField: 'siteId',
    parentModel: 'site',
  },
  bansheeRequest: {
    model: 'bansheeRequest',
    idField: 'id',
    parentField: 'siteId',
    parentModel: 'site',
  },
  bansheeTemplate: {
    model: 'bansheeTemplate',
    idField: 'id',
    parentField: 'companyId',
    parentModel: 'company',
  },
  bansheeCartItem: {
    model: 'bansheeCartItem',
    idField: 'id',
    parentField: 'companyId',
    parentModel: 'company',
  },
  bansheeOrder: {
    model: 'bansheeOrder',
    idField: 'id',
    parentField: 'companyId',
    parentModel: 'company',
  },
  bansheeOrderItem: {
    model: 'bansheeOrderItem',
    idField: 'id',
    parentField: 'orderId',
    parentModel: 'bansheeOrder',
  },
  invitation: {
    model: 'invitation',
    idField: 'id',
    parentField: 'companyId',
    parentModel: 'company',
  },
  company: {
    model: 'company',
    idField: 'id',
    parentField: null,
    parentModel: null,
  },
};

// TODO: Look over this function, check any potential security or performance issues
export async function resolveCompanyId(
  prisma: PrismaService,
  args: Record<string, any>,
  modelKey: string,
): Promise<string | null> {
  const modelKeyId = typeof args.id === 'string' ? args.id : undefined;
  let currentModel = modelKey as keyof typeof parentChain;
  let currentId = modelKeyId;

  while (currentModel && parentChain[currentModel]) {
    const { model, idField, parentField, parentModel } =
      parentChain[currentModel];

    // If no existing id (create mutations), try to jump to parent model and id
    if (!currentId && args && parentModel) {
      let parentId = args[parentField as string];

      if (!parentId) {
        const candidates: string[] = [];
        for (const value of Object.values(args)) {
          if (value === null || typeof value !== 'object') continue;

          if (Array.isArray(value)) {
            for (const item of value) {
              const v = item?.[parentField as string];
              if (typeof v === 'string') candidates.push(v);
            }
          } else {
            const v = (value as Record<string, any>)[parentField as string];
            if (typeof v === 'string') candidates.push(v);
          }
        }

        // Batch mutations must target a single parent — reject if items disagree.
        if (
          candidates.length > 0 &&
          candidates.every((c) => c === candidates[0])
        ) {
          parentId = candidates[0];
        }
      }

      if (!parentId) {
        return null;
      }

      currentModel = parentModel as keyof typeof parentChain;
      currentId = parentId;
      continue;
    }

    if (!currentId) {
      return null;
    }

    // If we're at company, return the id
    if (currentModel === 'company') {
      return currentId;
    }

    // @ts-expect-error: dynamic model access
    const resource = await prisma[model].findUnique({
      where: { [idField]: currentId },
      select: { [parentField as string]: true },
    });

    if (!resource) {
      return null;
    }

    currentId = resource[parentField as string];

    if (!parentModel) {
      return null;
    }
    currentModel = parentModel as keyof typeof parentChain;
  }
  return null;
}
