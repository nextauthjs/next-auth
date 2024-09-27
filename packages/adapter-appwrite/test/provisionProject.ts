import { AppwriteAdapterOptions } from "../src/index.ts";

export async function provisionProject(config: AppwriteAdapterOptions): Promise<string> {
    await awaitAppwriteServer(config.endpoint);

    // Create Account
    let res = await fetch(config.endpoint + '/account', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            'userId': 'unique()',
            'email': 'test@test.com',
            'password': 'password123',
            'name': 'Test Man'
        })
    });

    if (res.status !== 201) {
        throw new Error("Failed to create account");
    }

    console.log("Successfully created account");

    // Create Session
    res = await fetch(config.endpoint + '/account/sessions/email', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            'email': 'test@test.com',
            'password': 'password123',
        })
    });

    if (res.status !== 201) {
        throw new Error("Failed to create account session");
    }

    console.log("Successfully created account session");

    let auth = (res.headers.getSetCookie()).join(';');

    // Create Team
    res = await fetch(config.endpoint + '/teams', {
        'method': 'POST',
        'headers': {
            'cookie': auth,
            'content-type': 'application/json'
        },
        'body': JSON.stringify({
            "projectId": config.project_id,
            "name": 'Test Project',
            "teamId": 'unique()',
            "region": "default"
        })
    })

    if (res.status !== 201) {
        throw new Error("Failed to create account");
    }

    let teamId = (await res.json())['$id'];
    console.log("Successfully created team");

    // Create Project
    res = await fetch(config.endpoint + '/projects', {
        'method': 'POST',
        'headers': {
            'cookie': auth,
            'content-type': 'application/json'
        },
        'body': JSON.stringify({
            "projectId": config.project_id,
            "name": 'Test Project',
            "teamId": teamId,
            "region": "default"
        })
    })

    if (res.status !== 201) {
        console.log(await res.json());
        throw new Error("Failed to create project");
    }

    console.log("Successfully created project");

    // Create API Key
    res = await fetch(`${config.endpoint}/projects/${config.project_id}/keys`, {
        'method': 'POST',
        'headers': {
            'cookie': auth,
            'content-type': 'application/json'
        },
        'body': JSON.stringify({
            name: "some key",
            scopes: [
                "users.read",
                "users.write",
                "teams.read",
                "teams.write",
                "databases.read",
                "databases.write",
                "collections.read",
                "collections.write",
                "attributes.read",
                "attributes.write",
                "indexes.read",
                "indexes.write",
                "documents.read",
                "documents.write",
                "files.read",
                "files.write",
                "buckets.read",
                "buckets.write",
                "functions.read",
                "functions.write",
                "execution.read",
                "execution.write",
                "locale.read",
                "avatars.read",
                "health.read",
                "migrations.read",
                "migrations.write"
            ]
        })
    })

    if (res.status !== 201) {
        throw new Error("Failed to create API Key");
    }

    console.log("Successfully created API Key");

    let body = await res.json();
    let apiKey = body['secret'];

    return apiKey;
}

async function awaitAppwriteServer(endpoint: string) {
    for (let i = 0; i < 5; i++) {
        console.log(`Attempting to connect to Appwrite server, attempt ${i + 1}/5`);
        let response = await fetch(endpoint + '/health/version');

        // Wait 5 seconds, we even do with success as the DB might not be ready.
        await new Promise((resolve) => setTimeout(resolve, 5000));
        if (response.status == 200) {
            return true
        }
    }

    throw new Error('Failed to connect to Appwrite server after 5 tries.');
}