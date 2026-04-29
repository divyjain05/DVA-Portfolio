import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get('pin');

    if (pin !== process.env.ADMIN_PIN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    try {
        // Fetch all repos (public and private) for the authenticated user
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            const err = await response.json();
            return NextResponse.json({ error: err.message }, { status: response.status });
        }

        const repos = await response.json();
        
        // Map to a cleaner format
        const simplifiedRepos = repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            private: repo.private,
            updated_at: repo.updated_at,
            topics: repo.topics || []
        }));

        return NextResponse.json(simplifiedRepos);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
