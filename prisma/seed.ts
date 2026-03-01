import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Create or update System Settings
    const defaultSettings = await prisma.systemSetting.findFirst()
    if (!defaultSettings) {
        const settings = await prisma.systemSetting.create({
            data: {
                defaultMaxInstancesPerUser: 1,
                defaultMaxAdsPerUser: 10,
                defaultMaxSchedulesPerUser: 10,
                defaultMaxGroupsPerSchedule: 50,
            },
        })
        console.log('✅ Created SystemSettings:', settings.id)
    } else {
        console.log('✅ SystemSettings already exist.')
    }

    // Se o usuário pedir para criar um usuário inicial de teste no seed
    // podemos criar usando as funções internas do sistema.

    console.log('Seed finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
