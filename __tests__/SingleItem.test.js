import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import wait from "waait";
import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";

describe("<SingleItem />", () => {
  it("renders with proper data", async () => {
    const mocks = [
      {
        // when someone makes a request with this query and variables combo
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        // return this fake data (mocked data)
        result: {
          data: {
            item: fakeItem()
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );
    // console.log(wrapper.debug());
    expect(wrapper.text()).toContain("loading...");
    await wait();
    wrapper.update();
    expect(toJson(wrapper.find("h2"))).toMatchSnapshot();
    expect(toJson(wrapper.find("img"))).toMatchSnapshot();
    expect(toJson(wrapper.find("p"))).toMatchSnapshot();
    // console.log(wrapper.debug());
  });

  it("Errors with a not found item", async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        result: {
          errors: [
            {
              message: "Item not Found"
            }
          ]
        }
      }
    ];
    const wrapper = mount(
        <MockedProvider mocks={mocks}>
          <SingleItem id="123" />
        </MockedProvider>
      );
      await wait();
      wrapper.update();
      // console.log(wrapper.debug());
      // expect(toJson(wrapper.find('h2'))).toMatchSnapshot();
      const item = wrapper.find('[data-test="graphql-error"]');
      // console.log(item.debug());
      expect(item.text()).toContain('Item not Found');
      expect(toJson(item)).toMatchSnapshot();
  });
});
