import { act, renderHook } from "@testing-library/react-hooks";
import td from "testdouble";
import useAsyncAutocompleteController from "./async-autocomplete-controller";

type CustomOption = {
    label: string;
};

function toOption(label: string): CustomOption {
    return { label };
}

describe("useAsyncAutocompleteController", () => {
    type LoadOptionsType = (inputValue: string) => Promise<CustomOption[]>;
    const loadOptionsMock = td.func<LoadOptionsType>();

    const controller = () => useAsyncAutocompleteController<CustomOption>(
        { loadOptions: loadOptionsMock }
    );

    beforeEach(() => {
        td.when(loadOptionsMock(td.matchers.anything())).thenResolve([]);
    });

    it("should set open", async () => {
        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setOpen(true);
        });

        expect(result.current.open).toBe(true);
    });

    it("should set input value", async () => {
        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.inputValue).toBe("Milk");
    });

    it("should have loading as false by default", () => {
        const { result } = renderHook(controller);

        expect(result.current.loading).toBe(false);
    });

    it("should set loading to false after loading options", async () => {
        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.loading).toBe(false);
    });

    it("should set loading to false when there's an error in API call", async () => {
        td.when(loadOptionsMock("Milk")).thenReject(new Error("something happened"));

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Milk");
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.options).toEqual([]);
    });

    it("should load options when input value changes", async () => {
        td.when(loadOptionsMock("Mil"))
            .thenResolve([toOption("Milk"), toOption("Milky")]);

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
        });

        expect(result.current.options).toEqual([
            { label: "Milk" },
            { label: "Milky" },
        ]);
    });

    it("should reset input value and options", async () => {
        td.when(loadOptionsMock("Mil")).thenResolve([toOption("Milk")]);

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
            result.current.setOpen(true);
            result.current.clear();
        });

        expect(result.current.inputValue).toEqual("");
        expect(result.current.open).toEqual(false);
        expect(result.current.options).toEqual([]);
    });

    it("should clear select field when input is cleared", async () => {
        td.when(loadOptionsMock("Mil")).thenResolve([toOption("Milk")]);

        const { result } = renderHook(controller);

        await act(async () => {
            result.current.setInputValue("Mil");
        });

        await act(async () => {
            result.current.setInputValue("");
        });

        expect(result.current.inputValue).toEqual("");
        expect(result.current.open).toEqual(false);
        expect(result.current.loading).toEqual(false);
        expect(result.current.options).toEqual([]);
    });
});
