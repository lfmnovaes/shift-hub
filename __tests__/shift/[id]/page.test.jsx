import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupNextLinkMock, setupTest } from '@/__tests__/test-utils';

// Mock the db module
jest.mock('@/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([
      {
        id: 1,
        position: 'Emergency Room Nurse',
        companyName: 'City General Hospital',
        companyLocation: 'Downtown, City Center',
        payment: '$50/hr',
        hour: '07:00 - 15:00',
        date: '2025-03-02',
        serviceDescription: 'Emergency department nursing care',
        requirements: 'RN license, ER experience, ACLS certification',
        benefits: 'Sunday premium pay, meal voucher',
        userId: null,
      },
    ]),
  },
}));

// Mock the session module
jest.mock('@/lib/session', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({ id: 2, username: 'testuser' }),
}));

// Mock the ShiftDetailsClient component
jest.mock('@/app/shift/[id]/shift-details-client', () => {
  return function MockShiftDetailsClient({ shift }) {
    return (
      <div>
        <h1>{shift.position}</h1>
        <h2>{shift.companyName}</h2>
        <p>{shift.companyLocation}</p>
        <p>{shift.payment}</p>
        <p>{shift.hour}</p>
        <h3>Service Description</h3>
        <p>{shift.serviceDescription}</p>
        <h3>Requirements</h3>
        <p>{shift.requirements}</p>
        <h3>Benefits</h3>
        <p>{shift.benefits}</p>
        <h3>Date</h3>
        <p>{shift.date}</p>
        <a href="/shift">Back to Shifts</a>
        <button>Apply</button>
      </div>
    );
  };
});

describe('ShiftDetailsPage', () => {
  let ShiftDetailsPage;

  beforeEach(() => {
    setupTest();
    setupNextLinkMock();

    // Import the component after setting up mocks
    jest.isolateModules(() => {
      ShiftDetailsPage = require('@/app/shift/[id]/page').default;
    });
  });

  it('renders the shift details correctly', async () => {
    render(await ShiftDetailsPage({ params: { id: '1' } }));

    expect(screen.getByText('Emergency Room Nurse')).toBeInTheDocument();
    expect(screen.getByText('City General Hospital')).toBeInTheDocument();
    expect(screen.getByText('Downtown, City Center')).toBeInTheDocument();
    expect(screen.getByText('$50/hr')).toBeInTheDocument();
    expect(screen.getByText('07:00 - 15:00')).toBeInTheDocument();

    expect(screen.getByText('Service Description')).toBeInTheDocument();
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();

    expect(screen.getByText('Emergency department nursing care')).toBeInTheDocument();
    expect(screen.getByText('RN license, ER experience, ACLS certification')).toBeInTheDocument();
    expect(screen.getByText('Sunday premium pay, meal voucher')).toBeInTheDocument();

    expect(screen.getByText('Back to Shifts')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });
});
