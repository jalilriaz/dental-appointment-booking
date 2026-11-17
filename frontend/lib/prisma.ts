import { PrismaClient } from "../src/generated/client";

const prismaClientSingleton = () => {
    // Returns a new PrismaClient instance
    return new PrismaClient();
};

declare global {
    var prismaGlobalFix5: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobalFix5 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalFix5 = prisma;

