import { mount } from "enzyme";
import wait from "waait";
import PleaseSignin from "../components/PleaseSignin";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../lib/testUtils";

const notSignInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

describe("<PleaseSignin", () => {
  it("renders the sigin dialog to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignInMocks}>
        <PleaseSignin />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain("Please Sign in!");
    const Signin = wrapper.find("Signin");
    expect(Signin.exists()).toBe(true);
  });

  it("renders the child component when the user is signed in", async () => {
    const Hey = () => <p>Hey!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignin>
          <Hey />
        </PleaseSignin>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // expect(wrapper.find('Hey').exists()).toBe(true);
    expect(wrapper.contains(<Hey />)).toBe(true);
  });
});
