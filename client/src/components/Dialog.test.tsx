import { RenderResult, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dialog from './Dialog';

const mockOnConfirm = jest.fn();
const mockOnCancel = jest.fn();

describe('<Dialog>', () => {
  let instance: RenderResult;

  beforeEach(() => {
    instance = render(
      <Dialog
        title='example-title'
        body='example-body'
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    expect(screen).toBeDefined();
  });

  it('renders as dialog', () => {
    expect(screen.getByRole('dialog'));
  });

  it('renders the title', () => {
    expect(screen.getByText('example-title'));
  });

  it('renders the content', () => {
    expect(screen.getByText('example-body'));
  });

  it('renders the default confirmation button', () => {
    expect(screen.getByRole('button', { name: 'Confirm' }));
  });

  it('renders the default cancel button', () => {
    expect(screen.getByRole('button', { name: 'Cancel' }));
  });

  describe('when the confirm button is clicked', () => {
    it('triggers the confirmation handler', async () => {
      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: 'Confirm' });

      await user.click(button);

      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  describe('when the cancel button is clicked', () => {
    it('triggers the cancellation handler', async () => {
      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: 'Cancel' });

      await user.click(button);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('when a confirm button name is provided', () => {
    beforeEach(() => {
      instance.rerender(
        <Dialog
          title='example title'
          body='example body'
          confirmButton='example confirm'
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );
    });

    it('renders the confirm button with the provided name', () => {
      expect(screen.getByRole('button', { name: 'example confirm' }));
    });
  });

  describe('when a cancel button name is provided', () => {
    beforeEach(() => {
      instance.rerender(
        <Dialog
          title='example title'
          body='example body'
          cancelButton='example cancel'
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );
    });

    it('renders the cancel button with the provided name', () => {
      expect(screen.getByRole('button', { name: 'example cancel' }));
    });
  });
});
