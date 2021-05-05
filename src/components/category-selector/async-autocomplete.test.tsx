import { Autocomplete } from "@material-ui/lab";
import { mount, shallow } from "enzyme";
import td from "testdouble";
import AsyncAutocomplete from "./async-autocomplete";

type CustomOption = {
    label: string,
    value: string;
};

type OverridingProps = {
    value?: CustomOption
    inputValue?: string;
    setInputValue?(value: string): void;
    onChange?(option: CustomOption | null): void;
    getOptionLabel?(option: CustomOption): string
};

describe("AsyncAutocomplete", () => {
    const asyncAutocomplete = ({
        ...overridingProps
    }: OverridingProps = {}): JSX.Element => (
        <AsyncAutocomplete
            value={null}
            loading={false}
            inputValue=""
            setInputValue={() => {}}
            onChange={() => {}}
            options={[]}
            getOptionLabel={() => "label"}
            getOptionSelected={() => false}
            {...overridingProps}
        />
    );

    it("should have Autocomplete", () => {
        const wrapper = shallow(asyncAutocomplete());

        expect(wrapper.find(Autocomplete).exists()).toBe(true);
    });

    it("should have display option by label", () => {
        // given
        type SetInputValue = (value: string) => void;
        const setInputValueMock = td.func<SetInputValue>();

        const initialOption = { label: "custom option" } as CustomOption;

        // when
        mount(asyncAutocomplete({
            value: initialOption,
            getOptionLabel: (option) => option.label,
            setInputValue: (value) => setInputValueMock(value)
        }));

        // then
        td.verify(setInputValueMock(initialOption.label));
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
});
