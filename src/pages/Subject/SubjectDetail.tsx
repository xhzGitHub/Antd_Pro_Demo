import React, { useEffect, useReducer } from "react";
import { Row, Col, Card } from "antd";
import { getSubjectDetail } from "@/services/subject";

interface State {
  title: Subject.SubjectDetail["title"];
}

type Action = { type: "INIT"; payload: State };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...action.payload
      };
  }
};

const initialState = {
  title: ""
} as State;

export default function SubjectDetail(prop) {
  const alias = prop.match.id;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async () => {
      const res = await getSubjectDetail(alias);
    };
  }, []);
  return (
    <Row>
      <Col span={14}>
        <Card title="测试测试"></Card>
      </Col>
    </Row>
  );
}
