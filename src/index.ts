import TranscodeController from "./TranscodeController";


export const handler = async (event, context) => {
    const controller: TranscodeController = new TranscodeController();
    const response = await controller.Start(event);
};


