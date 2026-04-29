const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');
const { like } = MatchersV3;

const provider = new PactV3({
    consumer: 'UserServiceConsumer',
    provider: 'UserServiceProvider',
    dir: path.resolve(__dirname, '../contracts'),
});

describe('UserServiceConsumer', () => {
    it('deve buscar um usuario pelo id', async () => {
        await provider.addInteraction({
            uponReceiving: 'uma requisicao para buscar um usuario pelo id',
            withRequest: {
                method: 'GET',
                path: '/users/1',
                headers: {
                    Accept: like('application/json'),
                },
            },
            willRespondWith: {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    id: like(1),
                    name: like('John Doe'),
                    email: like('john@example.com'),
                },
            },
        });

        await provider.executeTest(async (mockServer) => {
            const response = await axios.get(`${mockServer.url}/users/1`, {
                headers: { Accept: 'application/json' },
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('id');
            expect(response.data).toHaveProperty('name');
            expect(response.data).toHaveProperty('email');
        });
    });
});
