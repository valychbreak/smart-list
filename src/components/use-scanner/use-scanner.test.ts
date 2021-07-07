import { act, renderHook } from "@testing-library/react-hooks";
import useScanner from ".";

describe("useScanner", () => {
    const controller = () => useScanner();
    const renderController = () => (
        renderHook(() => controller())
    );

    it("should enable scanner", () => {
        const { result } = renderController();

        act(() => result.current.enableScanner());

        expect(result.current.isScannerEnabled).toBe(true);
    });

    it("should disable scanner", () => {
        const { result } = renderController();

        act(() => {
            result.current.enableScanner();
            result.current.disableScanner();
        });

        expect(result.current.isScannerEnabled).toBe(false);
    });
});
