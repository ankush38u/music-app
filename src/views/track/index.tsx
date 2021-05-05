import { useEffect, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillSkipBackwardFill, BsFillSkipForwardFill } from 'react-icons/bs';
import { RiShuffleFill, RiRepeat2Fill, RiRepeatOneFill } from 'react-icons/ri';

import AudioSession from '../../services/audio-session';
import { Button, Slider, Visualizer } from '../../components';
import { SET_REPEAT } from '../../redux';
import { songTitle } from '../../utils';
import './styles.css';

type TrackProps = {
  song?: any;
  size?: any;
  range?: any;
  audio?: any;
  playing: boolean;
  onNext?: Function;
  onPrev?: Function;
  onPlay?: Function;
  onPause?: Function;
  onError?: Function;
  onChange?: Function;
  onShuffle?: Function;
  visualizer?: React.ReactNode;
};

const Track = ({
  song,
  size,
  range,
  audio,
  playing,
  onNext,
  onPrev,
  onPlay,
  onError,
  onPause,
  onChange,
  onShuffle,
}: TrackProps) => {
  const [meta, setMeta] = useState<any>(null);

  const dispatch = useDispatch();

  const settings = useSelector((state: any) => state.settings);

  const color = settings.light ? 'black' : 'white';

  const { tags = {} } = meta || {};

  const title = tags.title ?? songTitle(song);
  const artist = tags.artist ?? 'Unknown Artist';
  const picture = AudioSession.getPicture(meta);

  const handleRepeat = () => {
    const data: any = { all: 'one', one: 'none', none: 'all' };
    dispatch(SET_REPEAT(data[settings.repeat]));
  };

  useEffect(() => {
    (async () => {
      const meta = await AudioSession.getMetadata(song);

      setMeta(meta);
    })();
  }, [song]);

  return (
    <div className="track">
      <Slider
        value={range}
        audio={audio}
        onTouch={() => onPause && onPause()}
        onTouchEnd={() => onPlay && onPlay()}
        onChange={(v: number) => onChange && onChange(v)}
      >
        <div className="track__slider__img">
          <img alt={title} src={picture} />
        </div>
      </Slider>
      <div className="track__content">
        <div className="track__details">
          <h1>{title}</h1>
          <p>{artist}</p>
        </div>
        <div className="track__controls">
          <div
            className="track__controls__btn"
            onClick={() => onShuffle && onShuffle()}
          >
            <RiShuffleFill size={24} color={color} />
          </div>
          <div
            className="track__controls__btn"
            onClick={() => onPrev && onPrev()}
          >
            <BsFillSkipBackwardFill size={28} color={color} />
          </div>
          <div className="track__controls__btn">
            <Button
              size={64}
              active={playing}
              onClick={() =>
                playing ? onPause && onPause() : onPlay && onPlay()
              }
            >
              {playing ? <FaPause size={22} /> : <FaPlay size={22} />}
            </Button>
          </div>
          <div
            className="track__controls__btn"
            onClick={() => onNext && onNext()}
          >
            <BsFillSkipForwardFill size={28} color={color} />
          </div>
          <div className="track__controls__btn" onClick={() => handleRepeat()}>
            {settings.repeat === 'one' ? (
              <RiRepeatOneFill size={24} color={color} />
            ) : (
              <>
                {settings.repeat === 'none' && (
                  <div className="track__controls__cross"></div>
                )}
                <RiRepeat2Fill size={24} color={color} />
              </>
            )}
          </div>
        </div>
      </div>
      {settings.visualizer && (
        <Visualizer
          app
          audio={audio}
          playing={playing}
          width={size.width}
          className={'track__visualizer'}
          onError={() => onError && onError()}
        />
      )}
    </div>
  );
};

export default Track;
