import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames'
import { removeNotification } from '../../store/slices/notifications';

const NotificationHandler = () => {
    const { notifications } = useSelector(state => state);
    const dispatch = useDispatch();
    const variant = {
        danger: 'bg-red-500',
        success: 'bg-green-600',
    }
    useEffect(() => {
        const latestNotification = notifications.slice(-1)[0];


        if(latestNotification) {
            const timer = setTimeout(() => {
                if(latestNotification) {
                    dispatch(removeNotification(latestNotification.id))
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
      }, [notifications]);

    return (
        <div className="absolute top-[10px] right-1/2 flex flex-col justify-end">
            {notifications.map(({notification, id, type}) => (
                <div key={id} className={cx("p-[10px] text-white translate-x-[50%] mt-[16px] min-w-[100px] rounded-[5px] flex justify-center items-center z-10", variant[type])}>
                    {notification}
                </div>    
            ))}
        </div>
    )
}

export default NotificationHandler;