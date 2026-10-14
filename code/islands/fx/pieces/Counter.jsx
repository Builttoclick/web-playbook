// A counting number: React Bits CountUp as it is. Its server render is an EMPTY span; the generator fills the
// poster with the final number and a fixed-width box (see generator/islands.py fill_counters and css/counters.css).
import CountUp from '../../rb/CountUp/CountUp.jsx';

export default function Counter(p) {
  return <CountUp {...p} />;
}
