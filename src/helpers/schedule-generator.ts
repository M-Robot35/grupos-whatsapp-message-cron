interface ScheduleConfig {
    delayMin: number
    delayMax: number
}

/**
 * Utilitário de demonstração para criação inteligente do "scheduledAt"
 * nas Deliveries durante a seleção de 200 grupos para a mesma mensagem.
 *
 * Gera datas incrementais randomizadas entre [delayMin] e [delayMax] minutos.
 */
export function generateDeliveryTimestamps(groupsCount: number, config: ScheduleConfig, startDate: Date = new Date()): Date[] {
    const dates: Date[] = []

    // Começamos o controle a partir do 'startDate' passado, ou 'agora' se for omisso
    let currentPointer = new Date(startDate.getTime())

    for (let i = 0; i < groupsCount; i++) {
        // 0º Envio: Manda logo (sem delay)
        if (i === 0) {
            dates.push(new Date(currentPointer.getTime()))
            continue
        }

        // Grupos subsequentes: adiciona um gap randomico em Minutos entre o Envio anterior e este
        const randomMinutes = Math.floor(Math.random() * (config.delayMax - config.delayMin + 1)) + config.delayMin
        const gapMs = randomMinutes * 60 * 1000

        currentPointer = new Date(currentPointer.getTime() + gapMs)
        dates.push(currentPointer)
    }

    return dates
}

// Exemplo de uso no seu Controller/Action ao salvar 200 entregas (Deliveries):
/*
const groupIds = ['group1', 'group2', '...', 'groupN']
const schedule = { delayMin: 1, delayMax: 4 }
const timestamps = generateDeliveryTimestamps(groupIds.length, schedule)

// Crie todas de uma vez mapeando index a index:
const payload = groupIds.map((groupId, idx) => ({
  groupId,
  scheduleId,    
  workspaceId, 
  idempotencyKey: randomUUID(),
  scheduledAt: timestamps[idx]  // <-- Injeta a respectiva data crescente aqui!
}))
*/
