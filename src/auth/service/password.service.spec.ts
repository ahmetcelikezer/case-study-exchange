import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeAll(async () => {
    service = new PasswordService();
  });

  describe('hashPassword', () => {
    it('should hash password', async () => {
      const plainPassword = 'password';
      const hashedPassword = await service.hashPassword(plainPassword);

      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBe(60);
    });
  });

  describe('comparePassword', () => {
    it('should return true when password is correct', async () => {
      const plainPassword = 'password';
      const hashedPassword = await service.hashPassword(plainPassword);

      expect(await service.comparePassword(plainPassword, hashedPassword)).toBe(
        true,
      );
    });

    it('should return false when password is incorrect', async () => {
      const plainPassword = 'password';
      const hashedPassword = await service.hashPassword(plainPassword);

      expect(await service.comparePassword('incorrect', hashedPassword)).toBe(
        false,
      );
    });
  });
});
