import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from './hooks/useCountdown';
import { STATUS_WAITING, STATUS_SUCCESS } from './Constants'

const ExpiredNotice = () => {
    return (
        <div className="expired-notice">
            <span>Expired!!!</span>
            <p>Please contact with someone in ThinkUp.</p>
        </div>
    );
};

const WaitingNotice = () => {
    return (
        <div className="waiting-notice">
            <span>Waiting!!!</span>
            <p>Please download the file to init the test.</p>
        </div>
    );
};

const SuccessNotice = () => {
    return (
        <div className="success-notice">
            <span>GREAT!!!</span>
            <p>We will checking your code.</p>
        </div>
    );
};

const ShowCounter = ({ minutes, seconds }) => {
    return (
        <div className="show-counter">
            <a
                href='https://wwww.thinkupsoft.com/'
                target='_blank'
                rel="noopener noreferrer"
                className="countdown-link"
            >
                <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
            </a>
        </div>
    );
};


const CountdownTimer = ({ targetDate, hasStarted, callback }) => {
    const [minutes, seconds] = useCountdown(targetDate);

    if (hasStarted === STATUS_WAITING) {
        return <WaitingNotice />;
    } else if (hasStarted !== STATUS_SUCCESS && minutes + seconds <= 0) {
        callback()
        return <ExpiredNotice />;
    } else if (hasStarted === STATUS_SUCCESS) {
        return <SuccessNotice />;
    } else {
        return (
            <ShowCounter
                minutes={minutes}
                seconds={seconds}
            />
        );
    }
};

export default CountdownTimer;
