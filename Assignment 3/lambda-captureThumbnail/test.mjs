import { handler } from './index.mjs'; // Adjust the path to your handler file if necessary

const testEvent = {
    "Records": [
        {
            "s3": {
                "bucket": {
                    "name": "n12150801-assessment"
                },
                "object": {
                    "key": "videos/49095cd7-45ae-4530-a40f-37e19150e844"
                }
            }
        }
    ]
};

// Call the handler function with the test event
(async () => {
    try {
        const result = await handler(testEvent);
        console.log("Test Result:", result);
    } catch (error) {
        console.error("Error during test:", error);
    }
})();
