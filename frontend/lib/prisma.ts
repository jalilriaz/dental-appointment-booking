import { PrismaClient } from "../src/generated/client";

const prismaClientSingleton = () => {
    // Returns a new PrismaClient instance
    return new PrismaClient();
};

declare global {
    var prismaGlobalFix6: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobalFix6 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalFix6 = prisma;

