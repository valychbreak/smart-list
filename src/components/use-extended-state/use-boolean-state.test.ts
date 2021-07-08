import { act, renderHook } from "@testing-library/react-hooks";
import useBooleanState from "./use-boolean-state";

describe("useBooleanState", () => {
    const controller = () => useBooleanState();
    const renderController = () => (
        renderHook(() => controller())
    );

    const getInstance = (hook: [boolean, () => void, () => void]) => ({
        isActive: hook[0],
        enable: hook[1],
        disable: hook[2]
    });

    it("should enable", () => {
        const { result } = renderController();

        act(() => result.current[1]());

        expect(getInstance(result.current).isActive).toBe(true);
    });

    it("should disable", () => {
        const { result } = renderController();

        act(() => {
            getInstance(result.current).enable();
            getInstance(result.current).disable();
        });

        expect(getInstance(result.current).isActive).toBe(false);
    });
});
