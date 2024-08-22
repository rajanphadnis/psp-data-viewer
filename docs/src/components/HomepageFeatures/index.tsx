import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Mermaid from '@theme/Mermaid';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'API',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Running on a super simple serverless Azure cloud function, these Python-based
        API calls just process and read data from an HDF5 file and return it in simple JSON
      </>
    ),
  },
  {
    title: 'WebApp(s)',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Written in TypeScript and compiled via bun, the main, admin, and documentation
        sites are statically hosted on Firebase Hosting, and serve as a quick way to access
        data without calling the API
      </>
    ),
  },
  {
    title: 'Backend',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        To ease the number of API requests, and to make the website easier to use, frequently
        accessed data is stored within a Firestore database. Only authorized apps can access
        this database via Firebase App Check
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
