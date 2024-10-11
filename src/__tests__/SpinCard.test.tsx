import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import * as api from "../lib/api/slotmachine";
import SpinCard from "@/components/SpinCard";
import { useFingerprint } from "@/lib/api/hooks/useFingerprint";

jest.mock("../lib/api/slotmachine");
jest.mock("../lib/api/hooks/useFingerprint", () => ({
  useFingerprint: jest.fn(),
}));
describe("SpinCard", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.resetAllMocks();

    (api.getGameSlot as jest.Mock).mockResolvedValue({
      statusCode: 200,
      data: { credits: 50 },
    });

    api.getGameSlot.mockResolvedValue({
      statusCode: 200,
      data: { credits: 50 },
    });

    useFingerprint.mockReturnValue("12345");
  });

  it("render the SpinCard component", async () => {
    render(<SpinCard />);

    const credit = await screen.findByTestId("credits");

    expect(credit).toHaveTextContent("50");
  });

  it("spin the slot machine and display results", async () => {
    useFingerprint.mockReturnValue("123");
    api.rollGameSlot.mockResolvedValueOnce({
      statusCode: 200,
      data: { symbols: ["C", "L", "O"], updatedCredit: 30 },
    });

    render(<SpinCard />);

    expect(api.getGameSlot).toHaveBeenCalledTimes(1);
    const credit = await screen.findByTestId("credits");
    expect(credit).toHaveTextContent("50");
    jest.useFakeTimers();

    fireEvent.click(screen.getByTestId("spin"));

    await waitFor(() =>
      expect(screen.getByTestId("spin")).toHaveTextContent("Spinning...")
    );

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      const slot = screen.getByTestId("slot-0");
      expect(slot).toHaveTextContent("C");
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      const slot = screen.getByTestId("slot-1");
      expect(slot).toHaveTextContent("L");
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      const slot = screen.getByTestId("slot-2");
      expect(slot).toHaveTextContent("O");
    });

    await waitFor(() => {
      expect(screen.getByTestId("spin")).not.toHaveTextContent("Spinning...");
    });

    const credits = screen.getByTestId("credits");
    expect(credits).toHaveTextContent("30");
  });

  it("handle error when spinning", async () => {
    useFingerprint.mockReturnValue("123");
    api.rollGameSlot.mockRejectedValueOnce(new Error("Server error"));

    render(<SpinCard />);

    await act(async () => {
      jest.useFakeTimers();
    });

    fireEvent.click(screen.getByTestId("spin"));

    await waitFor(() =>
      expect(screen.getByTestId("spin")).toHaveTextContent("Spinning...")
    );

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByTestId("message")).toHaveTextContent(
        "Error: Couldn't connect to the server"
      );
    });

    expect(screen.getByTestId("spin")).not.toHaveTextContent("Spinning...");
  });

  it("cash out the credits", async () => {
    useFingerprint.mockReturnValue("123");
    api.cashOutGameSlot.mockResolvedValueOnce({
      statusCode: 200,
    });

    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<SpinCard />);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const cashout = await screen.getByTestId("cashout");

    expect(cashout).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(cashout);
    });

    const alterMessage = alertMock.mock.calls[0][0];
    expect(alterMessage).toBe("Cashing out 50 credits!");

    expect(api.cashOutGameSlot).toHaveBeenCalledTimes(1);

    const credits = screen.getByTestId("credits");
    expect(credits).toHaveTextContent("0");
    alertMock.mockRestore();
  });
});
