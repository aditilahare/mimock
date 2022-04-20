import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { mockedCookieGet } from 'mocks/cookieMock';
import AdminNavigator from './AdminNavigator.jsx';

jest.mock('react-router-dom');
jest.mock('styles/Loaders', () => {
	return {
		FullPageLoader: () => {
			return <div data-testid='loader'>Loading...</div>;
		},
	};
});

describe('AdminNavigator', () => {
	const TestComponent = () => {
		return <div data-testid='child'>Child component</div>;
	};

	it('should render child when auth token is valid', async () => {
		mockedCookieGet.mockImplementation(() => {
			return 'eyJpYXQiOiJNb24gQXByIDExIDIzOjQ0OjI3IElTVCAyMDIyIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VyTmFtZSI6Im1pbW9ja19hZG1pbiIsInVzZXJSb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6Im1pbW9ja19hZG1pbiIsImV4cCI6MTY0OTcwMjY2N30.LPui9yRnbtittDutEi6F05zNi4mUe_2plNx2EROxo_k';
		});

		let tree;
		await act(async () => {
			tree = await render(
				<AdminNavigator>
					<TestComponent />
				</AdminNavigator>
			);
		});
		const { getByTestId, container, queryByTestId } = tree;

		await waitFor(() => {
			expect(getByTestId('child')).toBeInTheDocument();
			expect(queryByTestId('loader')).not.toBeInTheDocument();
			expect(queryByTestId('navigator')).not.toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});

	it('should show permission error page when auth token is empty', async () => {
		mockedCookieGet.mockImplementation(() => {
			return '';
		});

		let tree;
		await act(async () => {
			tree = await render(
				<AdminNavigator>
					<TestComponent />
				</AdminNavigator>
			);
		});
		const { getByTestId, container, queryByTestId } = tree;

		await waitFor(() => {
			expect(getByTestId('permission-error-page')).toBeInTheDocument();
			expect(queryByTestId('child')).not.toBeInTheDocument();
			expect(queryByTestId('loader')).not.toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});

	it('should show permission error page when auth token is invalid', async () => {
		mockedCookieGet.mockImplementation(() => {
			return 'invalid.token';
		});

		let tree;
		await act(async () => {
			tree = await render(
				<AdminNavigator>
					<TestComponent />
				</AdminNavigator>
			);
		});
		const { getByTestId, container, queryByTestId } = tree;

		await waitFor(() => {
			expect(getByTestId('permission-error-page')).toBeInTheDocument();
			expect(queryByTestId('child')).not.toBeInTheDocument();
			expect(queryByTestId('loader')).not.toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});

	it('should show permission error page when user is not admin', async () => {
		mockedCookieGet.mockImplementation(() => {
			return 'eyJpYXQiOiJNb24gQXByIDExIDIzOjQ0OjI3IElTVCAyMDIyIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VyTmFtZSI6Im1pbW9ja19hZG1pbiIsInVzZXJSb2xlIjoiUk9MRV9NQU5BR0VSIiwic3ViIjoibWltb2NrX2FkbWluIiwiZXhwIjoxNjQ5NzAyNjY3fQ.LPui9yRnbtittDutEi6F05zNi4mUe_2plNx2EROxo_k';
		});

		let tree;
		await act(async () => {
			tree = await render(
				<AdminNavigator>
					<TestComponent />
				</AdminNavigator>
			);
		});
		const { getByTestId, container, queryByTestId } = tree;

		await waitFor(() => {
			expect(getByTestId('permission-error-page')).toBeInTheDocument();
			expect(queryByTestId('child')).not.toBeInTheDocument();
			expect(queryByTestId('loader')).not.toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});
});