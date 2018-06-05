import test from 'ava';

import memux from 'memux';
import init from '../lib';
import { NAME, KAFKA_ADDRESS, OUTPUT_TOPIC, INPUT_TOPIC, PAGE_SIZE, START_PAGE } from '../lib/config';

test('it exists', t => {
  t.not(init, undefined);
});

test('it works', async (t) => {
  try {
    let _resolve, _reject;
    const resultPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    const receive = (message) => {
      console.log('Received message!', message);
      _resolve(message);
    };

    await memux({
      name: 'dummy-broker',
      url: KAFKA_ADDRESS,
      input: OUTPUT_TOPIC,
      receive,
      options: {
        concurrency: 1
      }
    });

    // Do not await init here, it will wait for the miner to finish mining before resolving
    init({
      name: NAME,
    });

    const result = await resultPromise;
    console.log('Result data:', result.data);
    return t.deepEqual(result, {
      action: 'write',
      label: "feedbackfruits-knowledge-mit-miner",

      // FIXME: Noop
      key: result.key,
      data: result.data
      // FIXME: Noop

      // data: {
      //   "@id": "https://ocw.mit.edu/courses/physics",
      //   "@type": "Topic",
      //   "child": [
      //     "https://ocw.mit.edu/courses/physics/8-962-general-relativity-spring-2006",
      //     "https://ocw.mit.edu/courses/physics/8-952-particle-physics-of-the-early-universe-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-942-cosmology-fall-2001",
      //     "https://ocw.mit.edu/courses/physics/8-902-astrophysics-ii-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-901-astrophysics-i-spring-2006",
      //     "https://ocw.mit.edu/courses/physics/8-871-selected-topics-in-theoretical-particle-physics-branes-and-gauge-theory-dynamics-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-851-strong-interactions-effective-field-theories-of-qcd-spring-2006",
      //     "https://ocw.mit.edu/courses/physics/8-851-effective-field-theory-spring-2013",
      //     "https://ocw.mit.edu/courses/physics/8-821-string-theory-fall-2008",
      //     "https://ocw.mit.edu/courses/physics/8-821-string-theory-and-holographic-duality-fall-2014",
      //     "https://ocw.mit.edu/courses/physics/8-811-particle-physics-ii-fall-2005",
      //     "https://ocw.mit.edu/courses/physics/8-701-introduction-to-nuclear-and-particle-physics-spring-2004",
      //     "https://ocw.mit.edu/courses/physics/8-592j-statistical-physics-in-biology-spring-2011",
      //     "https://ocw.mit.edu/courses/physics/8-591j-systems-biology-fall-2014",
      //     "https://ocw.mit.edu/courses/physics/8-591j-systems-biology-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-514-strongly-correlated-systems-in-condensed-matter-physics-fall-2003",
      //     "https://ocw.mit.edu/courses/physics/8-513-many-body-theory-for-condensed-matter-systems-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-512-theory-of-solids-ii-spring-2009",
      //     "https://ocw.mit.edu/courses/physics/8-511-theory-of-solids-i-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-422-atomic-and-optical-physics-ii-spring-2013",
      //     "https://ocw.mit.edu/courses/physics/8-421-atomic-and-optical-physics-i-spring-2014",
      //     "https://ocw.mit.edu/courses/physics/8-334-statistical-mechanics-ii-statistical-physics-of-fields-spring-2014",
      //     "https://ocw.mit.edu/courses/physics/8-333-statistical-mechanics-i-statistical-mechanics-of-particles-fall-2013",
      //     "https://ocw.mit.edu/courses/physics/8-325-relativistic-quantum-field-theory-iii-spring-2007",
      //     "https://ocw.mit.edu/courses/physics/8-325-relativistic-quantum-field-theory-iii-spring-2003",
      //     "https://ocw.mit.edu/courses/physics/8-324-relativistic-quantum-field-theory-ii-fall-2010",
      //     "https://ocw.mit.edu/courses/physics/8-323-relativistic-quantum-field-theory-i-spring-2008",
      //     "https://ocw.mit.edu/courses/physics/8-322-quantum-theory-ii-spring-2003",
      //     "https://ocw.mit.edu/courses/physics/8-321-quantum-theory-i-fall-2017",
      //     "https://ocw.mit.edu/courses/physics/8-311-electromagnetic-theory-spring-2004",
      //     "https://ocw.mit.edu/courses/physics/8-286-the-early-universe-fall-2013",
      //     "https://ocw.mit.edu/courses/physics/8-284-modern-astrophysics-spring-2006",
      //     "https://ocw.mit.edu/courses/physics/8-282j-introduction-to-astronomy-spring-2006",
      //     "https://ocw.mit.edu/courses/physics/8-251-string-theory-for-undergraduates-spring-2007",
      //     "https://ocw.mit.edu/courses/physics/8-231-physics-of-solids-i-fall-2006",
      //     "https://ocw.mit.edu/courses/physics/8-224-exploring-black-holes-general-relativity-astrophysics-spring-2003",
      //     "https://ocw.mit.edu/courses/physics/8-223-classical-mechanics-ii-january-iap-2017",
      //     "https://ocw.mit.edu/courses/physics/8-21-the-physics-of-energy-fall-2009",
      //     "https://ocw.mit.edu/courses/physics/8-20-introduction-to-special-relativity-january-iap-2005",
      //     "https://ocw.mit.edu/courses/physics/8-13-14-experimental-physics-i-ii-junior-lab-fall-2007-spring-2008",
      //     "https://ocw.mit.edu/courses/physics/8-09-classical-mechanics-iii-fall-2014",
      //     "https://ocw.mit.edu/courses/physics/8-08-statistical-physics-ii-spring-2005",
      //     "https://ocw.mit.edu/courses/physics/8-07-electromagnetism-ii-fall-2012",
      //     "https://ocw.mit.edu/courses/physics/8-06-quantum-physics-iii-spring-2016",
      //     "https://ocw.mit.edu/courses/physics/8-06-quantum-physics-iii-spring-2005",
      //     "https://ocw.mit.edu/courses/physics/8-05-quantum-physics-ii-fall-2013",
      //     "https://ocw.mit.edu/courses/physics/8-044-statistical-physics-i-spring-2013",
      //     "https://ocw.mit.edu/courses/physics/8-04-quantum-physics-i-spring-2016",
      //     "https://ocw.mit.edu/courses/physics/8-04-quantum-physics-i-spring-2013",
      //     "https://ocw.mit.edu/courses/physics/8-03sc-physics-iii-vibrations-and-waves-fall-2016",
      //     "https://ocw.mit.edu/courses/physics/8-033-relativity-fall-2006",
      //     "https://ocw.mit.edu/courses/physics/8-03-physics-iii-spring-2003",
      //     "https://ocw.mit.edu/courses/physics/8-02x-physics-ii-electricity-magnetism-with-an-experimental-focus-spring-2005",
      //     "https://ocw.mit.edu/courses/physics/8-02t-electricity-and-magnetism-spring-2005",
      //     "https://ocw.mit.edu/courses/physics/8-022-physics-ii-electricity-and-magnetism-fall-2006",
      //     "https://ocw.mit.edu/courses/physics/8-022-physics-ii-electricity-and-magnetism-fall-2004",
      //     "https://ocw.mit.edu/courses/physics/8-022-physics-ii-electricity-and-magnetism-fall-2002",
      //     "https://ocw.mit.edu/courses/physics/8-02-physics-ii-electricity-and-magnetism-spring-2007",
      //     "https://ocw.mit.edu/courses/physics/8-01x-physics-i-classical-mechanics-with-an-experimental-focus-fall-2002",
      //     "https://ocw.mit.edu/courses/physics/8-01sc-classical-mechanics-fall-2016",
      //     "https://ocw.mit.edu/courses/physics/8-01l-physics-i-classical-mechanics-fall-2005",
      //     "https://ocw.mit.edu/courses/physics/8-012-physics-i-classical-mechanics-fall-2008"
      //   ],
      //   "image": [
      //     "https://ocw.mit.edu/courses/physics/dhp_8.jpg"
      //   ],
      //   "name": "Physics"
      // }
    });
    return t.fail();
  } catch(e) {
    console.error(e);
    throw e;
  }
});
