import { Autocomplete } from "@material-ui/lab";
import { mount, shallow } from "enzyme";
import td from "testdouble";
import TodoItemNameSelect, { TodoItemNameItem } from "./todo-item-name-select";

type OverridingProps = {
    inputValue?: string;
    setInputValue?(value: string): void;

    open?: boolean;
    setOpen?(isOpened: boolean): void;

    onTodoItemNameSelect?(todoItemName: string): void;
};

describe("TodoItemNameSelect", () => {
    const todoItemNameSelect = ({
        ...overridingProps
    }: OverridingProps = {}): JSX.Element => (
        <TodoItemNameSelect
            open={false}
            setOpen={() => {}}
            inputValue={""}
            setInputValue={() => {}}
            onTodoItemNameSelect={() => {}}
            options={[]}
            {...overridingProps}
        />
    );

    it("has Autocomplete", () => {
        const wrapper = shallow(todoItemNameSelect());

        expect(wrapper.find(Autocomplete).exists()).toBe(true);
    });

    it("should trigger input change", async () => {
        // given
        type SetInputValue = (value: string) => void;
        const setInputValueMock = td.func<SetInputValue>();

        const wrapper = mount(
            todoItemNameSelect({ setInputValue: setInputValueMock })
        );

        const autocompleteOnInputChange = wrapper
            .find(Autocomplete)
            .prop("onInputChange") as any;

        // when
        autocompleteOnInputChange({}, "Milk");

        // then
        td.verify(setInputValueMock("Milk"));
    });

    it("should trigger option select when input changes", async () => {
        // given
        type OnTodoItemNameSelect = (value: string) => void;
        const onTodoItemNameSelectMock = td.func<OnTodoItemNameSelect>();

        const wrapper = mount(
            todoItemNameSelect({
                onTodoItemNameSelect: onTodoItemNameSelectMock,
            })
        );

        const autocompleteOnInputChange = wrapper
            .find(Autocomplete)
            .prop("onInputChange") as any;

        // when
        autocompleteOnInputChange({}, "Custom input");

        // then
        td.verify(onTodoItemNameSelectMock("Custom input"));
    });

    it("should trigger todo item name select with TodoItemNameItem", async () => {
        // given
        type OnTodoItemNameSelect = (value: string) => void;
        const onTodoItemNameSelectMock = td.func<OnTodoItemNameSelect>();

        const wrapper = mount(
            todoItemNameSelect({
                onTodoItemNameSelect: onTodoItemNameSelectMock,
            })
        );

        const autocompleteOnChange = wrapper
            .find(Autocomplete)
            .prop("onChange") as any;

        // when
        autocompleteOnChange({}, {
            label: "Milk label",
            todoItemName: "Milk",
        } as TodoItemNameItem);

        // then
        td.verify(onTodoItemNameSelectMock("Milk"));
    });

    it("should trigger todo item name select with string", async () => {
        // given
        type OnTodoItemNameSelect = (value: string) => void;
        const onTodoItemNameSelectMock = td.func<OnTodoItemNameSelect>();

        const wrapper = mount(
            todoItemNameSelect({
                onTodoItemNameSelect: onTodoItemNameSelectMock,
            })
        );

        const autocompleteOnChange = wrapper
            .find(Autocomplete)
            .prop("onChange") as any;

        // when
        autocompleteOnChange({}, "Custom input");

        // then
        td.verify(onTodoItemNameSelectMock("Custom input"));
    });
});
