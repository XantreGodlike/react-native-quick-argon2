//
// Created by Szymon on 24/02/2022.
//

#pragma once

#include <ReactCommon/CallInvoker.h>
#include <jsi/jsi.h>

#include <memory>

#include "RNA2DispatchQueue.h"

namespace rnargon2 {

namespace jsi = facebook::jsi;
namespace react = facebook::react;

class JSI_EXPORT RNA2ThreadAwareHostObject : public jsi::HostObject {
   public:
    explicit RNA2ThreadAwareHostObject(
        std::shared_ptr<react::CallInvoker> jsCallInvoker,
        std::shared_ptr<DispatchQueue::dispatch_queue> workerQueue)
        : weakJsCallInvoker(jsCallInvoker), dispatchQueue(workerQueue) {}

    virtual ~RNA2ThreadAwareHostObject() {}

    void runOnWorkerThread(std::function<void(void)> &&job);
    void runOnJSThread(std::function<void(void)> &&job);

   protected:
    std::weak_ptr<react::CallInvoker> weakJsCallInvoker;
    std::shared_ptr<DispatchQueue::dispatch_queue> dispatchQueue;
};

}  // namespace rnargon2
