import { Row, Col } from 'antd';
import React from 'react';
import ReactPlayer from 'react-player';

//import SearchBox from '../../components/formFields/searchBox';

import Styles from './index.module.scss';

const HelpAddingComponent: React.FC = () => (
  <div>
    <h2>Help:</h2>Each section of the Pathway Builder Instructions can include
    Google Slides, recorded videos, and links to additional resources. This
    information is embedded in the Pathway Builder and available via the
    Credential Engine website’s Pathway Builder Tool page.
    <br />
    <h2>Contact Us: </h2>If you have any questions, please send them to
    publishing@credentialengine.org.  We monitor this email during normal U.S.
    business hours and typically respond within one business day.
    <br />
    <br />
    <Row gutter={25}>
      <Col span="9">
        {/*  <SearchBox placeholder="Search your Components" styleType="outline" />
        <h4>Adding First Component</h4>
        <p>Adding a condition</p>
        <p>Approving Pathway</p> */}
        <p>
          <ul>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.fw96o18exusf"
                target="_blank"
                rel="noreferrer"
              >
                Introduction
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.77u3lbs1zjw"
                target="_blank"
                rel="noreferrer"
              >
                CTDL Pathways and Credential Registry Pathway Builder
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.ze9qgh45pj3l"
                target="_blank"
                rel="noreferrer"
              >
                CTDL and Pathway Builder Terminology
              </a>
            </li>
            {/* <li>
  <a
             href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.pda9a2o0e3rg"
             target="_blank"
             rel="noreferrer"
           >
             Get Started Building Pathways
           </a>
  </li> */}
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.pda9a2o0e3rg"
                target="_blank"
                rel="noreferrer"
              >
                Planning and Analysis for Building Pathways
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.4r3f5ilb6fy6"
                target="_blank"
                rel="noreferrer"
              >
                Publish Your Pathway Components
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.6rydgcgpk36c"
                target="_blank"
                rel="noreferrer"
              >
                Start Building Your Pathway
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.a634lh1pcgqy"
                target="_blank"
                rel="noreferrer"
              >
                Deeper Dive Into Building Your Pathway
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.mjbtj1j12lmw"
                target="_blank"
                rel="noreferrer"
              >
                Returning to Your Pathway
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.raag97a1x3lg"
                target="_blank"
                rel="noreferrer"
              >
                Resolving Conflict and Error Messages
              </a>
            </li>
            {/* <li>
  <a
             href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.vb8xlkqfc6x0"
             target="_blank"
             rel="noreferrer"
           >
           Approving and Publishing Your Pathway
           </a>
  </li> */}
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.salm3wgd0qi7"
                target="_blank"
                rel="noreferrer"
              >
                Conditions and Constraints
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.seqak5guu936"
                target="_blank"
                rel="noreferrer"
              >
                Publishing a Progression Model
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.y5u6fkyjjut8"
                target="_blank"
                rel="noreferrer"
              >
                View Your Published Pathway
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1s5yKuTm9u5SGapOyEXV3tSS1jNV1XF0WAtRN_JXyWuM/edit?pli=1#heading=h.nmk2p5eq1rkr"
                target="_blank"
                rel="noreferrer"
              >
                Pathways Resource List
              </a>
            </li>
          </ul>
        </p>
      </Col>
      <Col span="15">
        <h2>Introduction to Pathway Builder Tool</h2>
        <p>
          The Pathway Builder offers a user-friendly drag and drop interface
          that allows you to visually construct your pathway. By using
          connectors, you can link the Pathway Components together to depict the
          progression towards the destination. This intuitive tool enables you
          to build pathways ranging from simple to complex, seamlessly
          incorporating data from multiple sources.
        </p>
        <br />
        <ReactPlayer
          className={Styles.player}
          url="https://www.youtube.com/playlist?list=PLGIuhTYIrqoTPmx2VxxzVnvErSP2-7Gjm"
          controls
        />
      </Col>
    </Row>
  </div>
);

export default HelpAddingComponent;
