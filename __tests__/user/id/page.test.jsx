import { notFound } from 'next/navigation';
import { setupTest } from '@/__tests__/test-utils';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/db';
import UserProfilePage from '@/app/user/[id]/page';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

jest.mock('@/lib/session', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('@/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword123',
        createdAt: new Date('2023-01-01T12:00:00Z'),
      },
    ]),
  },
}));

jest.mock('@/assets', () => ({
  UserIcon: () => null,
}));

describe('UserProfilePage', () => {
  beforeEach(() => {
    setupTest();
    jest.clearAllMocks();
  });

  it('redirects if user is not logged in', async () => {
    getCurrentUser.mockResolvedValue(null);

    await UserProfilePage({ params: { id: '1' } });

    expect(notFound).toHaveBeenCalled();
  });

  it('redirects if user ID is invalid', async () => {
    getCurrentUser.mockResolvedValue({ id: 1, username: 'testuser' });

    await UserProfilePage({ params: { id: 'invalid' } });

    expect(notFound).toHaveBeenCalled();
  });

  it('redirects if user is not found', async () => {
    getCurrentUser.mockResolvedValue({ id: 1, username: 'testuser' });
    db.where.mockResolvedValue([]);

    await UserProfilePage({ params: { id: '1' } });

    expect(notFound).toHaveBeenCalled();
  });
});
