import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import ChannelList from '../ChannelList';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))

describe('ChanneLList', () => {
    it('should render channel list', () => {
        const channels = [
            {
                id: 4,
                name: 'KTU'
            },
            {
                id: 5,
                name: 'work'
            },
        ]

        const { getByText } = render(
            <ChannelList onClickItem={() => {}} channels={channels} />
        )

        channels.forEach(({name}) => {
            expect(getByText(name)).toBeInTheDocument();
        })
    });

    it('should navigate to channel chat after click', async () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock)

        const channel = {
            id: 4,
            name: 'KTU'
        }  
    
        const onClickMock = jest.fn();

        const { getByText, getByRole } = render(
            <ChannelList onClickItem={onClickMock} channels={[channel]} />
        )

        const channelButton = getByRole('button', {
            name: channel.name
        })

        await act(() => {
            fireEvent.click(channelButton)
        });

        expect(getByText(channel.name)).toBeInTheDocument();
        expect(onClickMock).toBeCalled();
        expect(navigateMock).toBeCalledWith(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${channel.id}`);
    });
});