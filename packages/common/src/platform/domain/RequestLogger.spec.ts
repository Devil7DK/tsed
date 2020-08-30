import {expect} from "chai";
import * as Sinon from "sinon";
import {RequestLogger} from "./RequestLogger";

describe("RequestLogger", () => {
  it("should create a new Context and log all", () => {
    const logger = {
      info: Sinon.stub(),
      debug: Sinon.stub(),
      warn: Sinon.stub(),
      error: Sinon.stub(),
      trace: Sinon.stub(),
    };

    const requestLogger = new RequestLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/url",
      ignoreUrlPatterns: ["/admin"],
      minimalRequestPicker: (o: any) => ({...o, minimal: "minimal"}),
      completeRequestPicker: (o: any) => ({...o, complete: "complete"}),
    });

    Sinon.stub(requestLogger as any, "getDuration").returns(1);

    // WHEN
    requestLogger.debug({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info("message");
    requestLogger.warn({test: "test"});
    requestLogger.error({test: "test"});
    requestLogger.trace({test: "test"});

    requestLogger.flush();

    // THEN
    expect(logger.info).to.have.been.calledWithExactly({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.info).to.have.been.calledWithExactly({
      minimal: "minimal",
      duration: 1,
      reqId: "id",
      message: "message",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.debug).to.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.warn).to.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.error).to.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.trace).to.have.been.calledWithExactly({
      complete: "complete",
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
  });
  it("should create a new Context and log all (with minimalRequestPicker)", () => {
    const logger = {
      info: Sinon.stub(),
      debug: Sinon.stub(),
      warn: Sinon.stub(),
      error: Sinon.stub(),
      trace: Sinon.stub(),
    };

    const requestLogger = new RequestLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/url",
      ignoreUrlPatterns: ["/admin"],
    });

    Sinon.stub(requestLogger as any, "getDuration").returns(1);

    // WHEN
    requestLogger.debug({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info("message");
    requestLogger.warn({test: "test"});
    requestLogger.error({test: "test"});
    requestLogger.trace({test: "test"});

    requestLogger.flush();

    // THEN
    expect(logger.info).to.have.been.calledWithExactly({
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.info).to.have.been.calledWithExactly({
      duration: 1,
      reqId: "id",
      message: "message",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.debug).to.have.been.calledWithExactly({
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.warn).to.have.been.calledWithExactly({
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.error).to.have.been.calledWithExactly({
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
    expect(logger.trace).to.have.been.calledWithExactly({
      duration: 1,
      reqId: "id",
      test: "test",
      time: Sinon.match.instanceOf(Date),
    });
  });
  it("should create a new Context and log nothing when pattern match with url", () => {
    const logger = {
      info: Sinon.stub(),
      debug: Sinon.stub(),
      warn: Sinon.stub(),
      error: Sinon.stub(),
      trace: Sinon.stub(),
    };

    const requestLogger = new RequestLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/admin",
      ignoreUrlPatterns: ["/admin"],
      minimalRequestPicker: (o: any) => ({...o, minimal: "minimal"}),
      completeRequestPicker: (o: any) => ({...o, complete: "complete"}),
    });

    Sinon.stub(requestLogger as any, "getDuration").returns(1);

    // WHEN
    requestLogger.info({test: "test"});
    requestLogger.flush();

    // THEN
    return expect(logger.info).to.not.have.been.called;
  });
  it("should create a new Context and flush log when maxStackSize is reached", () => {
    const logger = {
      info: Sinon.stub(),
      debug: Sinon.stub(),
      warn: Sinon.stub(),
      error: Sinon.stub(),
      trace: Sinon.stub(),
    };

    const requestLogger = new RequestLogger(logger, {
      id: "id",
      startDate: new Date("2019-01-01"),
      url: "/admin",
      maxStackSize: 2,
      minimalRequestPicker: (o: any) => ({...o, minimal: "minimal"}),
      completeRequestPicker: (o: any) => ({...o, complete: "complete"}),
    });

    Sinon.stub(requestLogger as any, "getDuration").returns(1);

    // WHEN
    requestLogger.info({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info({test: "test"});
    requestLogger.info({test: "test"});

    // THEN
    return expect(logger.info).to.have.been.callCount(3);
  });
});
