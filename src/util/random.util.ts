import passwordGenerator from 'password-generator';

export class RandomUtil {
    async generateRandomString(): Promise<string> {
        return passwordGenerator(8, false);
    }
}
