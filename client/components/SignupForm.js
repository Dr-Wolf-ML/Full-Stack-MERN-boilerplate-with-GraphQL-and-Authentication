import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';

import AuthForm from './AuthForm';
import Signup from '../mutations/Signup';
import CurrentUser from '../queries/CurrentUser';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: [] }
  }

  componentWillUpdate(nextProps) {
    // this.props: the old, current set of this.props.
    // nextProps: the next set of props for when the component rerenders
    if (!this.props.data.user && nextProps.data.user) {
      // Hotdog!! We have a case to kick the user over to the Dashboard
      hashHistory.push('/dashboard');
    }
  }

  onSubmit({ email, password }) {
    this.props.mutate({
      variables: { email, password },
      refetchQueries: [{ query: CurrentUser }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
    });
  }

  render() {
    return (
      <div>
        <h3>Sign Up!</h3>
        <AuthForm
          errors={this.state.errors}
          onSubmit={this.onSubmit.bind(this)
        }/>
      </div>
    );
  }
}

export default compose(
  graphql(CurrentUser),
  graphql(Signup)
)(SignupForm);
