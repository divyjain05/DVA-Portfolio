import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'projects.json');

async function getProjects() {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveProjects(projects: any[]) {
    await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2));
}

export async function GET() {
    const projects = await getProjects();
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { pin, project } = body;

    if (pin !== process.env.ADMIN_PIN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await getProjects();
    const index = projects.findIndex((p: any) => p.id === project.id);

    if (index > -1) {
        projects[index] = { ...projects[index], ...project };
    } else {
        projects.push(project);
    }

    await saveProjects(projects);
    return NextResponse.json({ success: true, project });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const pin = searchParams.get('pin');

    if (pin !== process.env.ADMIN_PIN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let projects = await getProjects();
    projects = projects.filter((p: any) => p.id.toString() !== id);
    await saveProjects(projects);

    return NextResponse.json({ success: true });
}
