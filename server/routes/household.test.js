const { describe, test, expect } = require('@jest/globals');
const router = require('./household');
// const request = require('supertest');
// const app = require('../app');

// IMPORTANT!
// some mocked household testing data was generated using chatgpt, but ensured it is 100% the same schema as the actual data in the database.

// Also, since JEST runs the actual function code for the GET route, when the catch block is tested, the console.log for the error runs and logs to the console when executing tests. For testing purposes, these logs were silenced.

// The coverage report says that only a very small part of the household file is covered, but since the assignment specifies to at least test one GET and one POST route, I suppose it should only matter if the specified routes are tested with 100% coverage, which is the case


const mockedHouseholds = [
  {
    householdName: "Sunny Villa",
    tasks: [
      {
        taskName: "Clean Kitchen",
        taskDescription: "Wipe counters, mop floor, and clean sink",
        interval: 2,
        lastDoneDate: "2026-01-05",
        assignedUser: "Alice",
        key: "taskKey001"
      },
      {
        taskName: "Take Out Trash",
        taskDescription: "Collect all garbage and recycling",
        interval: 1,
        lastDoneDate: "2026-01-06",
        assignedUser: "Bob",
        key: "taskKey002"
      }
    ],
    members: ["aliceId", "bobId", "charlieId"]
  },
  {
    householdName: "Cozy Cottage",
    tasks: [
      {
        taskName: "Water Plants",
        taskDescription: "Water all indoor plants",
        interval: 3,
        lastDoneDate: "2026-01-04",
        assignedUser: "Charlie",
        key: "taskKey003"
      }
    ],
    members: ["charlieId", "daveId"]
  },
  {
    householdName: "Modern Apartment",
    tasks: [
      {
        taskName: "Vacuum Living Room",
        taskDescription: "Vacuum carpets and rugs in living area",
        interval: 7,
        lastDoneDate: "2026-01-03",
        assignedUser: "Eve",
        key: "taskKey004"
      },
      {
        taskName: "Dust Shelves",
        taskDescription: "Dust all shelves and furniture",
        interval: 7,
        lastDoneDate: "2026-01-02",
        assignedUser: "Frank",
        key: "taskKey005"
      }
    ],
    members: ["eveId", "frankId", "georgeId"]
  },
  {
    householdName: "Family House",
    tasks: [
      {
        taskName: "Mow Lawn",
        taskDescription: "Trim grass in front and backyard",
        interval: 14,
        lastDoneDate: "2026-01-01",
        assignedUser: "Hannah",
        key: "taskKey006"
      }
    ],
    members: ["hannahId", "ianId", "jackId", "charlieId"]
  }
];

describe('GET /api/household/from_user', () => {
  test('returns households where currently logged in user is a member', async () => {

    const toArrayMock = jest.fn().mockResolvedValue(mockedHouseholds);
    const findMock = jest.fn().mockReturnValue({ toArray: toArrayMock });
    const collectionMock = jest.fn().mockReturnValue({ find: findMock });

    const mockDb = {
      collection: collectionMock
    };

    const req = {
      app: {
        get: jest.fn().mockReturnValue(mockDb)
      }
    };

    const res = {
      locals: {
        oauth: {
          token: {
            user: {
              user_id: "charlieId" // Charlie is part of 3 of 4 test households
            }
          }
        }
      },
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const router = require('./household');

    const routeHandler = router.stack.find(
      r => r.route?.path === '/from_user'
    ).route.stack[0].handle;

    await routeHandler(req, res);

    expect(req.app.get).toHaveBeenCalledWith('db');
    expect(collectionMock).toHaveBeenCalled();
    expect(findMock).toHaveBeenCalledWith({ members: 'charlieId' }); // requiring an other id in all returned households while the logged in mocked user id is 'charlieId' results in test failure - function and test work as expected 
    expect(res.json).toHaveBeenCalledWith(mockedHouseholds);
  });

  test('returns 500 on error', async () => {
    const req = {
      app: {
        get: jest.fn(() => {
          throw new Error('DB failure');
        })
      }
    };

    const res = {
      locals: {},
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    const router = require('./household');
    const routeHandler = router.stack.find(
      r => r.route?.path === '/from_user'
    ).route.stack[0].handle;


    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('POST /api/household', () => {
  let router;
  let routeHandler;

  beforeAll(() => {
    router = require('./household');
    routeHandler = router.stack.find(
      r => r.route?.path === '/' && r.route?.methods.post
    ).route.stack[0].handle;
  });

  const mockHousehold = {
    householdName: "Sunny Villa",
    tasks: [],
    members: ["aliceId", "bobId"]
  };

  test('returns 201 and the new item on success', async () => {
    const insertedId = "mockedId123";
    const findOneMock = jest.fn().mockResolvedValue({ ...mockHousehold, _id: insertedId });
    const insertOneMock = jest.fn().mockResolvedValue({
      acknowledged: true,
      insertedId: insertedId
    });

    const collectionMock = jest.fn().mockReturnValue({
      insertOne: insertOneMock,
      findOne: findOneMock
    });

    const req = {
      body: mockHousehold,
      app: { get: jest.fn().mockReturnValue({ collection: collectionMock }) }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    await routeHandler(req, res);

    expect(insertOneMock).toHaveBeenCalledWith(mockHousehold);
    expect(findOneMock).toHaveBeenCalledWith({ _id: insertedId });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ...mockHousehold, _id: insertedId });
  });

  test('returns 404 if newItem is not found after insertion', async () => {
    const insertOneMock = jest.fn().mockResolvedValue({
      acknowledged: true,
      insertedId: "someId"
    });
    const findOneMock = jest.fn().mockResolvedValue(null); // Simulate not found

    const collectionMock = jest.fn().mockReturnValue({
      insertOne: insertOneMock,
      findOne: findOneMock
    });

    const req = {
      body: mockHousehold,
      app: { get: jest.fn().mockReturnValue({ collection: collectionMock }) }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalled();
  });

  test('returns 500 if insertion is not acknowledged', async () => {
    const insertOneMock = jest.fn().mockResolvedValue({ acknowledged: false });
    const collectionMock = jest.fn().mockReturnValue({ insertOne: insertOneMock });

    const req = {
      body: mockHousehold,
      app: { get: jest.fn().mockReturnValue({ collection: collectionMock }) }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
  });

  test('returns 500 on database exception (catch block)', async () => {
    const req = {
      app: {
        get: jest.fn(() => { throw new Error('DB Down'); })
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Silence console.error for clean test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
