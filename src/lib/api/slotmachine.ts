import { axiosCall } from "./axioscall";

export const rollGameSlot = async (payload: { sessionId: string }) => {
  try {
    const response = await axiosCall.post("/slot-machine/roll", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGameSlot = async (sessionId: string) => {
  try {
    const response = await axiosCall.get(`/slot-machine/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cashOutGameSlot = async (payload: { sessionId: string }) => {
  try {
    const response = await axiosCall.delete("/slot-machine/cashout", {
      data: payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
