import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { message: 'Endpoint de agendamento preparado para implementação das regras RRULE.' },
    { status: 501 }
  )
}
