import { Autocomplete } from "@material-ui/lab";
import { act } from "@testing-library/react";
import { mount, shallow } from "enzyme";
import td from "testdouble";
import AsyncAutocomplete from "./async-autocomplete";

type CustomOption = {
    label: string,
    value: string;
};

type OverridingProps = {
    inputValue?: string;
    setInputValue?(value: string): void;
    onChange?(option: CustomOption | null): void;
    loadOptions?(inputValue: string): Promise<CustomOption[]>;
    setOptions?(options: CustomOption[]): void;
};

describe("AsyncAutocomplete", () => {
    const asyncAutocomplete = ({
        ...overridingProps
    }: OverridingProps = {}): JSX.Element => (
        <AsyncAutocomplete
            loading={false}
            setLoading={() => {}}
            inputValue=""
            setInputValue={() => {}}
            onChange={() => {}}
            options={[]}
            setOptions={() => {}}
            getOptionLabel={() => "label"}
            getOptionSelected={() => false}
            loadOptions={() => Promise.resolve([])}
            {...overridingProps}
        />
    );

    it("should have Autocomplete", () => {
        const wrapper = shallow(asyncAutocomplete());

        expect(wrapper.find(Autocomplete).exists()).toBe(true);
    });

    it("should trigger input change", () => {
        // given
        type SetInputValue = (value: string) => void;
        const setInputValueMock = td.func<SetInputValue>();

        const wrapper = mount(
            asyncAutocomplete({ setInputValue: setInputValueMock })
        );

        const autocompleteOnInputChange = wrapper
            .find(Autocomplete)
            .prop("onInputChange") as any;

        // when
        autocompleteOnInputChange({}, "Milk");

        // then
        td.verify(setInputValueMock("Milk"));
    });

    it("should trigger selected option change", async () => {
        // given
        type OnOptionChange = (option: CustomOption | null) => void;
        const onSelectedOptionChange = td.func<OnOptionChange>();

        const wrapper = mount(
            asyncAutocomplete({
                onChange: onSelectedOptionChange,
            })
        );

        const autocompleteOnChange = wrapper
            .find(Autocomplete)
            .prop("onChange") as any;

        const selectedOption = {
            label: "label",
            value: "value",
        } as CustomOption;
        // when
        autocompleteOnChange({}, selectedOption);

        // then
        td.verify(onSelectedOptionChange(selectedOption));
    });

    it("should load options on input value change", async () => {
        // given
        const option = {
            label: "label",
            value: "value",
        } as CustomOption;

        const loadOptions = () => Promise.resolve([option]);

        type SetOptions = (options: CustomOption[]) => void;
        const setOptions = td.func<SetOptions>();

        // when
        await act(async () => {
            mount(
                asyncAutocomplete({
                    inputValue: "Mil",
                    loadOptions,
                    setOptions
                })
            );
        });

        // then
        td.verify(setOptions([option]));
    });
});
