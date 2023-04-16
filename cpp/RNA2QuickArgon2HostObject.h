// Copyright 2023 Xantre
#pragma once

#include <ReactCommon/CallInvoker.h>
#include <jsi/jsi.h>

#include <memory>

#include "JSIUtils/RNA2DispatchQueue.h"
#include "JSIUtils/RNA2SmartHostObject.h"
#include "JSIUtils/RNA2TypedArray.h"

namespace rnargon2 {

namespace jsi = facebook::jsi;
namespace react = facebook::react;

class JSI_EXPORT RNA2QuickArgon2HostObject : public RNA2SmartHostObject {
   public:
    explicit RNA2QuickArgon2HostObject(
        std::shared_ptr<react::CallInvoker> jsCallInvoker,
        std::shared_ptr<DispatchQueue::dispatch_queue> workerQueue);

    virtual ~RNA2QuickArgon2HostObject() { invalidateJsiPropNameIDCache(); }
};

}  // namespace rnargon2
