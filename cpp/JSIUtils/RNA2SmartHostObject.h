//
// Created by Szymon on 24/02/2022.
//

#pragma once

#include <ReactCommon/TurboModuleUtils.h>

#include <memory>
#include <string>
#include <utility>
#include <vector>

#include "RNA2JSIMacros.h"
#include "RNA2ThreadAwareHostObject.h"

namespace rnargon2 {

namespace jsi = facebook::jsi;
namespace react = facebook::react;

typedef std::function<jsi::Value(jsi::Runtime &runtime)> JSIValueBuilder;

typedef std::pair<std::string, JSIValueBuilder> FieldDefinition;

FieldDefinition buildPair(std::string name, jsi::HostFunctionType &&f);

class JSI_EXPORT RNA2SmartHostObject : public RNA2ThreadAwareHostObject {
   public:
    RNA2SmartHostObject(
        std::shared_ptr<react::CallInvoker> jsCallInvoker,
        std::shared_ptr<DispatchQueue::dispatch_queue> workerQueue)
        : RNA2ThreadAwareHostObject(jsCallInvoker, workerQueue) {}

    virtual ~RNA2SmartHostObject() {}

    std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime &runtime);

    jsi::Value get(jsi::Runtime &runtime, const jsi::PropNameID &propNameId);

    std::vector<std::pair<std::string, JSIValueBuilder>> fields;
};

}  // namespace rnargon2
