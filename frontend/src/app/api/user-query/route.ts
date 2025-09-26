import { NextResponse } from 'next/server';

type UserQuery = {
  name: string;
  age: number;
  hsaProvider: string;
  state: string;
  diagnosedConditions: string[];
  riskFactors: string[];
  preventativeTargets: string[];
};

function isValidUserQuery(body: unknown): body is UserQuery {
  if (typeof body !== 'object' || body === null) return false;
  const obj = body as Record<string, unknown>;
  return (
    typeof obj.name === 'string' &&
    typeof obj.age === 'number' && Number.isFinite(obj.age) &&
    typeof obj.hsaProvider === 'string' &&
    typeof obj.state === 'string' &&
    Array.isArray(obj.diagnosedConditions) && obj.diagnosedConditions.every((v) => typeof v === 'string') &&
    Array.isArray(obj.riskFactors) && obj.riskFactors.every((v) => typeof v === 'string') &&
    Array.isArray(obj.preventativeTargets) && obj.preventativeTargets.every((v) => typeof v === 'string')
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidUserQuery(body)) {
      return NextResponse.json(
        { error: 'Invalid payload. Expected { name, age, hsaProvider, state, diagnosedConditions[], riskFactors[], preventativeTargets[] }' },
        { status: 400 }
      );
    }

    // TODO: Persist or process the user query as needed
    // For now, echo back the normalized payload
    return NextResponse.json({ ok: true, data: body });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}


