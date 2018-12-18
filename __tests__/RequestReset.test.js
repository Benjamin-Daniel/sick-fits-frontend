import { mount } from "enzyme";
import wait from "waait";
import toJson from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import RequestReset, {
  REQUEST_RESET_MUTATION
} from "../components/RequestReset";

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: "benjamindaniel706@gmail.com" }
    },
    result: {
      data: {
        requestReset: {
          message: "success",
          __typename: "Message"
        }
      }
    }
  }
];

describe("<RequestReset", () => {
  it("renders and matches SnapShot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJson(form)).toMatchSnapshot();
  });

  it("calls the mutation", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate typing an email;
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: "benjamindaniel706@gmail.com" }
    });
    // submit the form
    wrapper.find("form").simulate("submit");
    await wait();
    wrapper.update();
    expect(wrapper.find("p").text()).toContain("Success! check your email for a email reset");
  });
});
