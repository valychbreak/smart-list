import { shallow } from "enzyme";
import ExportItem from "./export-item";
import ExportItemList from "./export-item-list";

type OverridingProps = {
    exportItems: ExportItem[];
};

function createExportItem(id: number, generalName: string) {
    return new ExportItem(
        id,
        generalName,
        1,
        true,
        null,
        null,
        null,
        null,
        null
    );
}

describe("ExportItemList", () => {
    const exportItemList = ({ ...overridingProps }: OverridingProps) => (
        <ExportItemList onEdit={() => {}} {...overridingProps} />
    );

    it("should display all todo items", () => {
        const exportItems = [
            createExportItem(1, "Milk"),
            createExportItem(2, "Bread"),
        ];

        const wrapper = shallow(exportItemList({ exportItems }));

        expect(wrapper).toMatchSnapshot();
    });
});
