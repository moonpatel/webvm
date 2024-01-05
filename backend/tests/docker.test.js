const { containerExists, createContainer, pullImage } = require("../docker");
const { randomUUID } = require("crypto");

// Mocking the child_process.exec function
jest.mock("child_process");
const { exec } = require('child_process');

describe('containerExists', () => {
  let containerName;

  beforeEach(() => {
    containerName = randomUUID();
  });

  test('Container does not exist', async () => {
    // Mock exec to simulate container not existing
    exec.mockImplementation((command, callback) => {
      callback("", '', "Error: No such object:");
    });

    const exists = await containerExists(containerName);
    expect(exec).toHaveBeenCalledWith(`docker inspect ${containerName}`, expect.any(Function));
    expect(exists).toBe(false);
  });

  test('Container exists', async () => {
    // Mock exec to simulate container existing
    exec.mockImplementation((command, callback) => {
      callback(null, 'containerId', '');
    });

    const exists = await containerExists(containerName);
    expect(exec).toHaveBeenCalledWith(`docker inspect ${containerName}`, expect.any(Function));
    expect(exists).toBe(true);
  });

  // Add cleanup logic here if necessary
});


describe("createContainer", () => {
  it("should resolve with container ID on successful container creation", async () => {
    const expectedContainerId = "containerId";
    // Mock the exec function to simulate successful container creation
    exec.mockImplementation((command, callback) =>
      callback(null, expectedContainerId, "")
    );

    const containerName = "testContainer";
    const imageName = "testImage";
    const port = 8099;
    const result = await createContainer(containerName, imageName, port);

    // Assert that the exec function was called with the correct arguments
    expect(exec).toHaveBeenCalledWith(
      `docker run -d --name ${containerName} -p ${port}:80 ${imageName} tail -f /dev/null`,
      expect.any(Function)
    );

    // Assert that the result matches the expected container ID
    expect(result).toEqual(expectedContainerId);
  });

  it('should reject with an error on container creation failure', async () => {
    // Mock the exec function to simulate a failed container creation
    exec.mockImplementation((command, callback) => callback("error", '', "docker: Error response from daemon: Conflict."));

    const containerName = 'testContainer';
    const imageName = 'testImage';

    // Assert that createContainer rejects with the correct error message
    await expect(createContainer(containerName, imageName)).rejects.toThrow(new Error(`Container named ${containerName} already exists.`));
  });

  // Cleanup mocks after all tests
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
