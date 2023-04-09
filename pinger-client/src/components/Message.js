import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ReactSVG } from 'react-svg';
import { useLoadedImage } from '@Common'
import { DropDown } from '@Components';

const Message = ({
    body,
    sender, 
    id, 
    removeMessage, 
    initiateEditionMode, 
    edited, 
    files, 
    fileDownloadEndpoint,
  }) => {
    const profileImage = useLoadedImage(
      sender && `http://localhost:5122/api/public-file/${sender.profilePictureId}`,
      'http://localhost:5122/public/profile-pic.png'
    )
    const { userId } = useSelector((state) => state.auth);
    const [expanded, setExpanded] = useState(false);
  
    return (
      <div
        className={cx('p-[10px] mt-[10px] flex justify-between text-white group')}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex max-w-[90%]">
          <div className="mr-[10px] max-w-[40px] max-h-[40px] min-w-[40px] min-h-[40px]">
            {profileImage && <img
              src={profileImage}
              width="100%"
              height="100%"
              className="rounded-full aspect-square"
            />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-medium mr-[5px]">{sender?.userName}</span>
              {edited && <span className="text-xs">(Edited)</span>}
            </div>
            <div className="break-words">
              {body}
            </div>
            {files?.map(({ id, name }) => (
              <div key={id} className="flex items-center">
                <ReactSVG
                  src="http://localhost:5122/public/icons/file.svg"
                  beforeInjection={(svg) => {
                    svg.setAttribute('width', '24px');
                    svg.setAttribute('height', '24px');
                  }}
                />
                <a href={`http://localhost:5122/api/${fileDownloadEndpoint}/${id}`} target="_blank" download={name} className="text-white break-all hover:text-slate-300 ml-[10px]" rel="noreferrer">{name}</a>
              </div>
            ))}
          </div>
        </div>
        <div className={cx('flex-col hidden', {
          'group-hover:flex': sender.id === userId,
        })}
        >
          <DropDown
            expanded={expanded}
            setExpanded={setExpanded}
            activationElement={(toggle) => (
              <button onClick={toggle}>
                <ReactSVG
                  src="http://localhost:5122/public/icons/three-dots-vertical.svg"
                  beforeInjection={(svg) => {
                    svg.setAttribute('width', '24px');
                    svg.setAttribute('height', '24px');
                  }}
                />
              </button>
            )}
            options={[
              {
                buttonText: 'Remove',
                action: (toggle) => { removeMessage(id); toggle(); },
              },
              {
                buttonText: 'Edit',
                disabled: !body,
                action: (toggle) => { initiateEditionMode(id); toggle(); },
              },
            ]}
          />
        </div>
      </div>
    );
  }
  
  export default Message;