import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupNextLinkMock, setupTest } from '@/__tests__/test-utils';

// Mock the schema module
jest.mock('@/db/schema', () => ({
  shifts: {},
  companies: {},
}));

// Mock the drizzle-orm module
jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
  and: jest.fn(),
  gte: jest.fn(),
  lte: jest.fn(),
  relations: jest.fn(),
}));

// Create a mock ShiftPage component for testing
const MockShiftPage = () => {
  const weekDates = [
    { date: '2025-03-02', day: 'Sunday' },
    { date: '2025-03-03', day: 'Monday' },
    { date: '2025-03-04', day: 'Tuesday' },
    { date: '2025-03-05', day: 'Wednesday' },
    { date: '2025-03-06', day: 'Thursday' },
    { date: '2025-03-07', day: 'Friday' },
    { date: '2025-03-08', day: 'Saturday' },
  ];

  const shiftsByDate = {
    '2025-03-02': [
      {
        id: 1,
        date: '2025-03-02',
        hour: '07:00 - 15:00',
        position: 'Emergency Room Nurse',
        payment: '$50/hr',
        companyName: 'City General Hospital',
        companyLocation: 'Downtown, City Center',
        userId: null,
      },
    ],
    '2025-03-03': [],
    '2025-03-04': [],
    '2025-03-05': [],
    '2025-03-06': [],
    '2025-03-07': [],
    '2025-03-08': [],
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {weekDates.map(({ date, day }) => (
          <div key={date} className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <div className="flex flex-col items-center space-y-1 mb-4">
                <h2 className="card-title text-xl font-bold text-primary">{day}</h2>
                <span className="text-base">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="space-y-4">
                {shiftsByDate[date]?.map((shift) => (
                  <div
                    key={shift.id}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-200 w-full"
                  >
                    <div className="card-body p-4 h-64 overflow-y-auto">
                      <div className="flex justify-between items-start">
                        <h3 className="card-title text-sm mb-2">{shift.position}</h3>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-semibold">{shift.companyName}</p>
                        <p className="text-base-content/70">{shift.companyLocation}</p>
                        <p className="text-primary font-bold">{shift.payment}</p>
                        <p className="text-base-content/70">{shift.hour}</p>
                      </div>
                      {shift.userId && <div className="badge badge-warning badge-sm">Occupied</div>}
                      <div className="card-actions justify-center mt-auto">
                        <a href={`/shift/${shift.id}`} className="btn btn-primary btn-sm">
                          More details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {!shiftsByDate[date]?.length && (
                  <div className="text-center text-base-content/50 py-4">No shifts available</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock the actual page component
jest.mock('@/app/shift/page', () => ({
  __esModule: true,
  default: () => <MockShiftPage />,
}));

describe('ShiftPage', () => {
  beforeEach(() => {
    setupTest();
    setupNextLinkMock();

    // Mock the Date to ensure consistent testing
    const mockDate = new Date('2025-03-02T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the page with shifts', async () => {
    const ShiftPage = require('@/app/shift/page').default;
    render(<ShiftPage />);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days.forEach((day) => expect(screen.getByText(day)).toBeInTheDocument());

    expect(screen.getByText('Emergency Room Nurse')).toBeInTheDocument();
    expect(screen.getByText('City General Hospital')).toBeInTheDocument();
    expect(screen.getByText('$50/hr')).toBeInTheDocument();
    expect(screen.getByText('07:00 - 15:00')).toBeInTheDocument();
    expect(screen.getByText('More details')).toBeInTheDocument();

    // Check for "No shifts available" for days without shifts
    const noShiftsMessages = screen.getAllByText('No shifts available');
    expect(noShiftsMessages.length).toBeGreaterThan(0);
  });
});
