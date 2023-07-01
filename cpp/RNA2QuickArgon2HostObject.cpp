#include "RNA2QuickArgon2HostObject.h"

#include <jsi/jsi.h>

#include <thread>

#include "../argon2/include/argon2.h"
#include "JSIUtils/RNA2TypedArray.h"
#include "RNA2Argon2.cpp"

using namespace facebook::jsi;
namespace jsi = facebook::jsi;

namespace rnargon2 {

static Options toOptions(Runtime &runtime, const jsi::Object &options) {
  return {
      options.hasProperty(runtime, "secret") &&
              options.getProperty(runtime, "secret").isObject()
          ? arrayBufferToVector(runtime,
                                options.getPropertyAsObject(runtime, "secret"))
          : ustring{},
      options.hasProperty(runtime, "associatedData") &&
              options.getProperty(runtime, "associatedData").isObject()
          ? arrayBufferToVector(
                runtime, options.getPropertyAsObject(runtime, "associatedData"))
          : ustring{},
      static_cast<uint32_t>(
          options.getProperty(runtime, "hashLength").asNumber()),
      static_cast<uint32_t>(
          options.getProperty(runtime, "timeCost").asNumber()),
      static_cast<uint32_t>(
          options.getProperty(runtime, "memoryCost").asNumber()),
      static_cast<uint32_t>(
          options.getProperty(runtime, "parallelism").asNumber()),
      static_cast<uint32_t>(options.getProperty(runtime, "version").asNumber()),
      argon2_type(options.getProperty(runtime, "type").asNumber())};
}

RNA2QuickArgon2HostObject::RNA2QuickArgon2HostObject(
    std::shared_ptr<react::CallInvoker> jsCallInvoker,
    std::shared_ptr<DispatchQueue::dispatch_queue> workerQueue)
    : RNA2SmartHostObject(jsCallInvoker, workerQueue) {
  this->fields.push_back(buildPair(
      "hash", JSIF([this]) {
        if (count != 2) {
          throw jsi::JSError(runtime, "2 args should be provided");
        }
        auto plain = std::make_shared<ustring>(
            arrayBufferToVector(runtime, arguments[0].asObject(runtime)));

        auto optionsArg = arguments[1].asObject(runtime);
        auto salt = std::make_shared<ustring>(arrayBufferToVector(
            runtime, optionsArg.getPropertyAsObject(runtime, "salt")));

        auto options =
            std::make_shared<Options>(toOptions(runtime, optionsArg));

        TypedArray<TypedArrayKind::Uint8Array> resultArray(
            runtime, static_cast<size_t>(options->hash_length));
        auto result = resultArray.getBuffer(runtime);
        auto resultData = result.data(runtime);
        auto resultArrayGCFriendly =
            std::make_shared<jsi::ArrayBuffer>(std::move(result));

        return react::createPromiseAsJSIValue(
            runtime, [=](jsi::Runtime &runtime,
                         std::shared_ptr<react::Promise> promise) {
              this->runOnWorkerThread([=]() {
                auto context =
                    make_context(resultData, *plain, *salt, *options);
                auto result = argon2_ctx(&context, options->type);

                if (result != ARGON2_OK) {
                  this->runOnJSThread(
                      [=] { promise->reject(argon2_error_message(result)); });
                  return;
                }

                this->runOnJSThread([=]() {
                  promise->resolve(std::move(*resultArrayGCFriendly));
                });
              });
            });
      }));
}

} // namespace rnargon2
