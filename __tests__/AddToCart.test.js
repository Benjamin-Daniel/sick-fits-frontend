import { mount } from "enzyme";
import wait from "waait";
import toJson from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import AddToCart, { ADD_TO_CART_MUTAION } from "../components/AddToCart";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeCartItem, fakeUser } from "../lib/testUtils";

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: []
        }
      }
    }
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  },
  {
    request: { query: ADD_TO_CART_MUTAION, variables: { id: "abc123" } },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1
        }
      }
    }
  }
];

describe("<Cart />", () => {
  it("renders and matches snap shot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJson(wrapper.find("button"))).toMatchSnapshot();
    // expect(wrapper.find("CartItem")).toHaveLength(1);
  });
  it("adds an item when clicked", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const {
      data: { me }
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // expect me.cart to have length of 0
    expect(me.cart).toHaveLength(0);
    wrapper.find("button").simulate("click");
    await wait();
    // check if the item is in the cart;
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    const me2 = res.data.me;
    expect(me2.cart).toHaveLength(1);
    expect(me2.cart[0].id).toBe("omg123");
    expect(me2.cart[0].quantity).toBe(3);
  });

  it("changes from add to adding when clicked", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />;
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain("Add To Cart");
    wrapper.find("button").simulate("click");
    expect(wrapper.text()).toContain("Adding To Cart");
  });
});
