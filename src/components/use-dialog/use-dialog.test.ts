import { act, renderHook } from "@testing-library/react-hooks";
import useDialog from "./use-dialog";

type DialogPayload = {
    field: string;
};

describe("useProductDialog", () => {
    describe("with payload", () => {
        const dialog = () => useDialog<DialogPayload>();
        const renderDialog = () => renderHook(() => dialog());

        const payload: DialogPayload = { field: "value" };

        it("should open dialog", () => {
            const { result } = renderDialog();

            act(() => {
                result.current.openDialog(payload);
            });

            expect(result.current.isOpened).toBe(true);
            expect(result.current.payload).toBe(payload);
        });

        it("should close dialog", () => {
            const { result } = renderDialog();

            act(() => {
                result.current.openDialog(payload);
            });

            act(() => {
                result.current.closeDialog();
            });

            expect(result.current.isOpened).toBe(false);
            expect(result.current.payload).toBe(null);
        });
    });

    describe("without payload", () => {
        const dialog = () => useDialog<void>();
        const renderDialog = () => renderHook(() => dialog());

        it("should open dialog", () => {
            const { result } = renderDialog();

            act(() => {
                result.current.openDialog();
            });

            expect(result.current.isOpened).toBe(true);
            expect(result.current.payload).toBe(null);
        });

        it("should close dialog", () => {
            const { result } = renderDialog();

            act(() => {
                result.current.openDialog();
            });

            act(() => {
                result.current.closeDialog();
            });

            expect(result.current.isOpened).toBe(false);
            expect(result.current.payload).toBe(null);
        });
    });
});
