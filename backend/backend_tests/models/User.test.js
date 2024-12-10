import mongoose from 'mongoose';
import User from '../../models/User';
import dotenv from 'dotenv';

dotenv.config();


describe('User Model', () => {
    beforeAll(async () => {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Disconnect from the database
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the User collection before each test
        await User.deleteMany({});
    });

    describe('User.signup static method', () => {
        it('should create a new user', async () => {
            const user = await User.signup('test@test.com', 'Test123!');
            expect(user.email).toBe('test@test.com');
            expect(user.password).not.toBe('Test123!'); // Password should be hashed
        });

        it('should not create user with invalid email', async () => {
            await expect(User.signup('invalid-email', 'Test123!'))
                .rejects
                .toThrow('invalid email');
        });
    });

    describe('User.login static method', () => {
        beforeEach(async () => {
            // Create a user before each login test
            await User.signup('test@test.com', 'Test123!');
        });

        it('should login valid user', async () => {
            const user = await User.login('test@test.com', 'Test123!');
            expect(user.email).toBe('test@test.com');
        });

        it('should not login with wrong password', async () => {
            await expect(User.login('test@test.com', 'WrongPass123!'))
                .rejects
                .toThrow('incorrect password');
        });
    });
});
